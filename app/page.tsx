'use client'

import { values, get, set } from 'idb-keyval';
import { useState, useEffect } from 'react';
import SearchComp from './searchcomp';
import { Results } from './results';

export interface lawdata {
  id: number
  absaetze: string
  name: string
  gesetzname: string
  paragraph: string
  altname: string
};

//const DB_NAME = "gesetzeDB";
//const DB_VERSION = 1;

export default function Home() {
  const [data, setData] = useState<lawdata[]>([]);
  const [searchterm, setSearchTerm] = useState("")
  const [results, setResults] = useState<lawdata[]>([]);
  const [rescount, setResCount] = useState(20);
  const [err, setError] = useState(false);

  async function getDataFetch(): Promise<lawdata[] | null> {
    try {

      const res = await fetch('/general.json');
      const jso: lawdata[] = await res.json();
      setData(jso)
      return jso;
    }
    catch (error) {
      console.log(error);
    }
    return null;
  }
  const setDataDB = (data: lawdata[]) => {
    if (data.length != 0) {
      data.forEach((val) => {
        set(val.id, val)
      });
    } else {
      console.log(data);
      console.log("data == null");
    }
  }

  async function checkConnection() {
    return get(0).then((val) => {
      return val == null
    })
  }
  async function getDataFromDB() {
    values().then((valuess) => setData(valuess))
  }
  async function getData() {
    if (!('indexedDB' in window)) {
      console.log("This browser doesn't support IndexedDB");
      await getDataFetch();
      return;
    }
    const isnew = await checkConnection();
    if (isnew) {
      const arr = await getDataFetch();
      if (arr != null) {
        setDataDB(arr)
      }
      return;
    }
    await getDataFromDB();
  }

  useEffect(() => {
    getData();
  })

  return (
    <div className="flex flex-col justify-center text-neutral-200 items-center h-screen w-screen overflow-x-hidden">
      <SearchComp rescount={rescount} setError={setError} setResults={setResults} setResCount={setResCount} setSearchTerm={setSearchTerm} data={data} />
      <div className="flex-5/6 flex flex-col bg-slate-900 w-full h-full justify-center items-center overflow-y-auto">
        <Results results={results} err={err} searchterm={searchterm} />
      </div>

    </div>
  );
}

