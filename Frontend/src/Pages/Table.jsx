import React, { useEffect, useState } from "react";
import styles from "./Table.module.css";

const deleteTable = (tableNo, setTableInfo) => {
  const storedTableInfo = localStorage.getItem("tableinfo");
  if (storedTableInfo) {
    let tableInfo = JSON.parse(storedTableInfo);

    tableInfo = tableInfo.filter((table) => table.tableNo !== tableNo);

    const updatedTableInfo = tableInfo.map((table, idx) => ({
      ...table,
      tableNo: idx + 1,
    }));
    localStorage.setItem("tableinfo", JSON.stringify(updatedTableInfo));
    setTableInfo(updatedTableInfo);
    return updatedTableInfo;
  }
};

const TableCard = ({ tableNo, chairNo, onDelete }) => {
  return (
    <div className={styles.tableCard}>
      <div className={styles.tableDelete} onClick={() => onDelete(tableNo)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
          />
        </svg>
      </div>
      <h1>Table</h1>

      <h1>{tableNo}</h1>
      <div className={styles.chairs}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="17"
          viewBox="0 0 32 32"
        >
          <path
            fill="currentColor"
            d="M11 4v12.438c-.102.027-.223.066-.313.093c-.484.149-.82.305-1.062.469a2 2 0 0 0-.313.25c-.078.082-.187.25-.187.25L9 17.719V20h1v8h2v-8h8v8h2v-8h1v-2.281l-.125-.219s-.11-.168-.188-.25a2 2 0 0 0-.312-.25c-.242-.164-.578-.32-1.063-.469c-.09-.027-.21-.066-.312-.093V4h-2v1h-6V4zm2 3h2v9.031c-.758.02-1.438.04-2 .094zm4 0h2v9.125c-.563-.055-1.242-.074-2-.094z"
          />
        </svg>
        {chairNo}
      </div>
    </div>
  );
};

export default function Table() {
  const [tableNo, setTableNo] = useState(0);
  const [chairs, setChairs] = useState(0);
  const [tableinfo, setTableInfo] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const storedTableInfo = localStorage.getItem("tableinfo");
    if (storedTableInfo) {
      setTableInfo(JSON.parse(storedTableInfo));
    } else {
      const initialTableInfo = Array.from({ length: 10 }, (_, i) => ({
        tableNo: i + 1,
        chairNo: 4,
      }));
      setTableInfo(initialTableInfo);
      localStorage.setItem("tableinfo", JSON.stringify(initialTableInfo));
    }
  }, []);

  const [isnewTable, setIsNewTable] = useState(false);

  const handleNewTable = (e) => {
    e.preventDefault();
    const newTable = {
      tableNo: tableinfo.length + 1,
      chairNo: chairs || 4,
    };
    const updatedTableInfo = [...tableinfo, newTable];
    setTableInfo(updatedTableInfo);
    localStorage.setItem("tableinfo", JSON.stringify(updatedTableInfo));
    setIsNewTable(false);
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className={styles.tableHeader}>
        <div className={styles.tableCircle}></div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
        />
      </div>
      <div className={styles.tablePage}>
        <h1>Tables</h1>
        <div className={styles.tableContainer}>
          {tableinfo
            .filter((table) =>
              search === "" ? true : table.tableNo.toString().includes(search)
            )
            .map((table, index) => (
              <TableCard
                key={index}
                tableNo={table.tableNo}
                chairNo={table.chairNo}
                onDelete={(tableNo) => deleteTable(tableNo, setTableInfo)}
              />
            ))}
          <div
            className={styles.addTable}
            onClick={() => setIsNewTable(!isnewTable)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" />
            </svg>
          </div>
          {isnewTable && (
            <div className={styles.newNewTable}>
              <p>Table name (optional)</p>
              <input
                type="text"
                name=""
                id=""
                placeholder={tableinfo.length + 1}
              />
              <hr style={{ borderTop: "0.5vh dotted black", width: "15vh" }} />
              <div style={{ alignSelf: "flex-start" }}>
                <p>chair</p>
                <select
                  onChange={(e) => setChairs(e.target.value)}
                  value={chairs}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
              <button onClick={handleNewTable} className={styles.createButton}>
                Create
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
