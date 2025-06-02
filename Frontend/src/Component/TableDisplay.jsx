import React from "react";
import styles from "./Table.module.css"

export default function TableDisplay({ no, status }) {
  return (
    <div className={styles.tableCont} style={{backgroundColor: status  ? "#3DC35F":"white", color: status ? "white":"black"}}> 
      <p>Table</p>
      <p>{no}</p>
    </div>
  );
}
