/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.3
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const selectData = {
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ],
  role: [
      { value: "user", label: "User" },
      { value: "manager", label: "Manager" },
      { value: "team-leader", label: "Team Leader" },
  ],
  branch: [
    { value: "Gurgaon", label: "Gurgaon" },
    { value: "Noida", label: "Noida" },
  ],
  shift: [
    { value: "day", label: "Day Shift" },
    { value: "night", label: "Night Shift" },
  ],
  pfesi: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
  leaveType: [
    { value: "casual", label: "Casual Leave" },
    { value: "sick", label: "Sick Leave" },
    { value: "negative", label: "Negative Leave" },
    { value: "maternity", label: "Maternity Leave" },
    { value: "paternity", label: "Paternity Leave" },
  ],
  relocate: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
  employementStatus: [
    { value: "employed", label: "Employed" },
    { value: "unemployed", label: "Unemployed" },
    { value: "fresher", label: "Fresher" },
  ],
  birthDate: [
    { value: "january", label: "January" },
    { value: "february", label: "February" },
    { value: "march", label: "March" },
    { value: "april", label: "April" },
    { value: "may", label: "May" },
    { value: "june", label: "June" },
    { value: "july", label: "July" },
    { value: "august", label: "August" },
    { value: "september", label: "September" },
    { value: "october", label: "October" },
    { value: "november", label: "November" },
    { value: "december", label: "December" },
  ],
  days: [
    { value: 1, label: 1 },
    { value: 2, label: 2 },
    { value: 3, label: 3 },
    { value: 4, label: 4 },
    { value: 5, label: 5 },
    { value: 6, label: 6 },
    { value: 7, label: 7 },
    { value: 8, label: 8 },
    { value: 9, label: 9 },
    { value: 10, label: 10 },
    { value: 11, label: 11 },
    { value: 12, label: 12 },
    { value: 13, label: 13 },
    { value: 14, label: 14 },
    { value: 15, label: 15 },
    { value: 16, label: 16 },
    { value: 17, label: 17 },
    { value: 18, label: 18 },
    { value: 19, label: 19 },
    { value: 20, label: 20 },
    { value: 21, label: 21 },
    { value: 22, label: 22 },
    { value: 23, label: 23 },
    { value: 24, label: 24 },
    { value: 25, label: 25 },
    { value: 26, label: 26 },
    { value: 27, label: 27 },
    { value: 28, label: 28 },
    { value: 29, label: 29 },
    { value: 30, label: 30 },
    { value: 31, label: 31 },
  ],
  years: [
    { value: 1900, label: 1900 },
    { value: 1901, label: 1901 },
    { value: 1902, label: 1902 },
    { value: 1903, label: 1903 },
    { value: 1904, label: 1904 },
    { value: 1905, label: 1905 },
    { value: 1906, label: 1906 },
    { value: 1907, label: 1907 },
    { value: 1908, label: 1908 },
    { value: 1909, label: 1909 },
    { value: 1910, label: 1910 },
    { value: 1911, label: 1911 },
    { value: 1912, label: 1912 },
    { value: 1913, label: 1913 },
    { value: 1914, label: 1914 },
    { value: 1915, label: 1915 },
    { value: 1915, label: 1915 },
    { value: 1915, label: 1915 },
    { value: 1916, label: 1916 },
    { value: 1917, label: 1917 },
    { value: 1918, label: 1918 },
    { value: 1919, label: 1919 },
    { value: 1920, label: 1920 },
    { value: 1921, label: 1921 },
    { value: 1922, label: 1922 },
    { value: 1923, label: 1923 },
    { value: 1924, label: 1924 },
    { value: 1925, label: 1925 },
    { value: 1926, label: 1926 },
    { value: 1927, label: 1927 },
    { value: 1928, label: 1928 },
    { value: 1929, label: 1929 },
    { value: 1930, label: 1930 },
    { value: 1931, label: 1931 },
    { value: 1932, label: 1932 },
    { value: 1933, label: 1933 },
    { value: 1934, label: 1934 },
    { value: 1935, label: 1935 },
    { value: 1936, label: 1936 },
    { value: 1937, label: 1937 },
    { value: 1938, label: 1938 },
    { value: 1939, label: 1939 },
    { value: 1940, label: 1940 },
    { value: 1941, label: 1941 },
    { value: 1942, label: 1942 },
    { value: 1943, label: 1943 },
    { value: 1944, label: 1944 },
    { value: 1945, label: 1945 },
    { value: 1946, label: 1946 },
    { value: 1947, label: 1947 },
    { value: 1948, label: 1948 },
    { value: 1949, label: 1949 },
    { value: 1950, label: 1950 },
    { value: 1951, label: 1951 },
    { value: 1952, label: 1952 },
    { value: 1953, label: 1953 },
    { value: 1954, label: 1954 },
    { value: 1955, label: 1955 },
    { value: 1956, label: 1956 },
    { value: 1957, label: 1957 },
    { value: 1958, label: 1958 },
    { value: 1959, label: 1959 },
    { value: 1960, label: 1960 },
    { value: 1961, label: 1961 },
    { value: 1962, label: 1962 },
    { value: 1963, label: 1963 },
    { value: 1964, label: 1964 },
    { value: 1965, label: 1965 },
    { value: 1966, label: 1966 },
    { value: 1967, label: 1967 },
    { value: 1968, label: 1968 },
    { value: 1969, label: 1969 },
    { value: 1970, label: 1970 },
    { value: 1971, label: 1971 },
    { value: 1972, label: 1972 },
    { value: 1973, label: 1973 },
    { value: 1974, label: 1974 },
    { value: 1975, label: 1975 },
    { value: 1976, label: 1976 },
    { value: 1977, label: 1977 },
    { value: 1978, label: 1978 },
    { value: 1979, label: 1979 },
    { value: 1980, label: 1980 },
    { value: 1981, label: 1981 },
    { value: 1982, label: 1982 },
    { value: 1983, label: 1983 },
    { value: 1984, label: 1984 },
    { value: 1985, label: 1985 },
    { value: 1986, label: 1986 },
    { value: 1987, label: 1987 },
    { value: 1988, label: 1988 },
    { value: 1989, label: 1989 },
    { value: 1990, label: 1990 },
    { value: 1991, label: 1991 },
    { value: 1992, label: 1992 },
    { value: 1993, label: 1993 },
    { value: 1994, label: 1994 },
    { value: 1995, label: 1995 },
    { value: 1996, label: 1996 },
    { value: 1997, label: 1997 },
    { value: 1998, label: 1998 },
    { value: 1999, label: 1999 },
    { value: 2000, label: 2000 },
    { value: 2001, label: 2001 },
    { value: 2002, label: 2002 },
    { value: 2003, label: 2003 },
    { value: 2004, label: 2004 },
    { value: 2005, label: 2005 },
    { value: 2006, label: 2006 },
    { value: 2007, label: 2007 },
    { value: 2008, label: 2008 },
    { value: 2009, label: 2009 },
    { value: 2010, label: 2010 },
    { value: 2011, label: 2011 },
    { value: 2012, label: 2012 },
    { value: 2013, label: 2013 },
    { value: 2014, label: 2014 },
    { value: 2015, label: 2015 },
    { value: 2016, label: 2016 },
    { value: 2017, label: 2017 },
    { value: 2018, label: 2018 },
    { value: 2019, label: 2019 },
    { value: 2020, label: 2020 },
    { value: 2021, label: 2021 },
  ],
};

export default selectData;
