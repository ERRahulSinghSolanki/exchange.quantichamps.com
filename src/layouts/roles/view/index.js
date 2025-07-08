/**
 *  src/pages/admin/RolePermissions.jsx
 *  -----------------------------------
 *  • Top‑level permissions shown as flat rows; child permissions appear lazily when arrow is clicked
 *  • Tri‑state checkboxes with parent/child sync
 *  • Unlimited nesting — collapsible via <ChevronRight/ExpandMore> rotation
 *  • PUT /roles/:id/permissions endpoint unchanged
 *
 *  Peer deps →  npm i @mui/icons-material @mui/material
 */

import React, { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SoftBox         from "components/SoftBox";
import SoftTypography  from "components/SoftTypography";
import SoftButton      from "components/SoftButton";
import SoftSnackbar    from "components/SoftSnackbar";

import {
  CircularProgress,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { API_URL } from "config";

const RolePermissions = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------------- state ---------------- */
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState(null);
  const [perms, setPerms] = useState([]);
  const [chosen, setChosen] = useState(() => new Set()); // selected ids
  const [expanded, setExpanded] = useState(() => new Set()); // open rows

  const [snack, setSnack] = useState({ open: false, color: "success", message: "" });

  /* ---------------- helpers ---------------- */
  /** group by parent for fast look‑ups */
  const grouped = useMemo(() => {
    const g = {};
    perms.forEach((p) => ((g[p.parent_id ?? 0] ||= []).push(p)));
    return g;
  }, [perms]);

  /** map of child → parent */
  const parentOf = useMemo(() => {
    const m = {};
    perms.forEach((p) => (m[p.id] = p.parent_id ?? 0));
    return m;
  }, [perms]);

  /** collect all descendants (BFS) */
  const collectDescendants = useCallback(
    (pid) => {
      const stack = [...(grouped[pid] || [])];
      const all = [];
      while (stack.length) {
        const node = stack.pop();
        all.push(node.id);
        stack.push(...(grouped[node.id] || []));
      }
      return all;
    },
    [grouped]
  );

  /** whether checkbox should be indeterminate */
  const isIndeterminate = useCallback(
    (pid) => {
      const children = grouped[pid] || [];
      if (!children.length) return false;
      let some = false,
        all = true;
      for (const child of children) {
        const childChecked = chosen.has(child.id);
        const childIndet = isIndeterminate(child.id);
        if (childChecked || childIndet) some = true;
        if (!childChecked) all = false;
        if (some && !all) break;
      }
      return some && !all;
    },
    [grouped, chosen]
  );

  /* --------------- selection toggle --------------- */
  const toggleSelect = useCallback(
    (pid) => {
      setChosen((prev) => {
        const next = new Set(prev);
        const desc = collectDescendants(pid);

        if (next.has(pid)) {
          next.delete(pid);
          desc.forEach((d) => next.delete(d));
        } else {
          next.add(pid);
          desc.forEach((d) => next.add(d));
        }

        // update ancestors
        let parent = parentOf[pid];
        while (parent) {
          const siblings = grouped[parent] || [];
          const allSel = siblings.every((s) => next.has(s.id));
          const noneSel = siblings.every((s) => !next.has(s.id));
          if (allSel) next.add(parent);
          else if (noneSel) next.delete(parent);
          parent = parentOf[parent];
        }
        return next;
      });
    },
    [collectDescendants, grouped, parentOf]
  );

  /* --------------- expand toggle --------------- */
  const toggleExpand = useCallback((pid) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(pid) ? n.delete(pid) : n.add(pid);
      return n;
    });
  }, []);

  /* --------------- row renderer --------------- */
  const renderRows = useCallback(
    (parent = 0, level = 0) =>
      (grouped[parent] || []).map((perm) => {
        const hasChildren = (grouped[perm.id] || []).length > 0;
        const open = expanded.has(perm.id);
        const checked = chosen.has(perm.id);
        const indeterminate = isIndeterminate(perm.id);

        return (
          <Fragment key={perm.id}>
            <SoftBox
              pl={level * 3}
              display="flex"
              alignItems="center"
              py={0.75}
              sx={{ userSelect: "none" }}
            >
              {/* Arrow */}
              {hasChildren ? (
                <IconButton size="small" onClick={() => toggleExpand(perm.id)}>
                  <ChevronRightIcon
                    fontSize="small"
                    sx={{
                      transform: open ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </IconButton>
              ) : (
                <Box width={40 /* equal to IconButton width for alignment */} />
              )}

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={checked}
                ref={(el) => el && (el.indeterminate = indeterminate)}
                onChange={() => toggleSelect(perm.id)}
                style={{ marginRight: 8 }}
              />

              {/* Label */}
              <SoftTypography variant="body2" fontWeight={level === 0 ? 600 : 400}>
                {perm.name}
              </SoftTypography>
            </SoftBox>

            {/* Children */}
            {hasChildren && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                {renderRows(perm.id, level + 1)}
              </Collapse>
            )}
          </Fragment>
        );
      }),
    [grouped, expanded, chosen, isIndeterminate, toggleExpand, toggleSelect]
  );

  /* --------------- fetch data --------------- */
  useEffect(() => {
    setLoading(true);
    const abort = new AbortController();
    const token = localStorage.getItem("authToken");

    (async () => {
      try {
        const [roleRes, permRes] = await Promise.all([
          fetch(`${API_URL}/roles/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: abort.signal,
          }),
          fetch(`${API_URL}/permissions?per_page=10000`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: abort.signal,
          }),
        ]);

        if (!roleRes.ok || !permRes.ok) throw new Error("API error");

        const r = (await roleRes.json()).role;
        const ps = (await permRes.json()).permissions;
        setRole(r);
        setPerms(ps);
        setChosen(new Set(r.permissions?.map((p) => p.id) || []));
      } catch (err) {
        if (err.name !== "AbortError")
          setSnack({ open: true, color: "error", message: "Failed to load data" });
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [id]);

  /* --------------- save handler --------------- */
  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`${API_URL}/roles/${id}/permissions`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissions: Array.from(chosen) }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Save failed");
      setSnack({ open: true, color: "success", message: "Permissions updated!" });
    } catch (err) {
      setSnack({ open: true, color: "error", message: err.message });
    } finally {
      setSaving(false);
    }
  };

  /* --------------- ui --------------- */
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <SoftSnackbar
        color={snack.color}
        icon="notifications"
        title="Role"
        content={snack.message}
        open={snack.open}
        close={() => setSnack((s) => ({ ...s, open: false }))}
        time={3000}
      />

      {loading ? (
        <SoftBox py={10} display="flex" justifyContent="center">
          <CircularProgress />
        </SoftBox>
      ) : (
        <SoftBox p={3}>
          <SoftTypography variant="h5" mb={3}>
            Permissions for <strong>{role?.name}</strong>
          </SoftTypography>

          {/* List of permissions */}
          {renderRows()}

          <SoftBox mt={4} display="flex" gap={2}>
            <SoftButton
              variant="gradient"
              color="dark"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Update Permissions"}
            </SoftButton>

            <SoftButton
              variant="outlined"
              color="dark"
              onClick={() => navigate("/roles/list")}
              disabled={saving}
            >
              Back to Roles
            </SoftButton>
          </SoftBox>
        </SoftBox>
      )}
    </DashboardLayout>
  );
};

export default RolePermissions;
