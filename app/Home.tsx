'use client';
import { set, get, values } from 'idb-keyval';
import { useState, useEffect } from 'react';
import { default as useDebouncedCallback } from 'use-debounce';
import { lawdata, BreakException } from './page';
import SearchComp from './searchcomp';


export default function Home() {
  const [data, setData] = useState<lawdata[]>([]);
  const [searchterm, setSearchTerm] = useState("");
  const [results, setResults] = useState<lawdata[]>([]);
  const [rescount, setResCount] = useState(20);
  const [err, setError] = useState(false);

  async function getDataFetch(): Promise<lawdata[] | null> {
    try {

      const res = await fetch('/general.json');
      const jso: lawdata[] = await res.json();
      setData(jso);
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
        set(val.id, val);
      });
    } else {
      console.log(data);
      console.log("data == null");
    }
  };

  async function checkConnection() {
    return get(0).then((val) => {
      return val == null;
    });
  }
  async function getDataFromDB() {
    values().then((valuess) => setData(valuess));
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
        setDataDB(arr);
      }
      return;
    }
    await getDataFromDB();
  }

  useEffect(() => {
    getData();
  });

  const handleSearch = useDebouncedCallback((term: string) => {
    if (data.length == 0) {
      console.log("NO DATA LOADED");
      setError(true);
      return;
    }
    if (term == "") {
      setResults([]);
      return;
    }
    setSearchTerm(term);
    const res: lawdata[] = [];
    try {

      data.forEach((val) => {
        if (res.length >= rescount) {
          throw BreakException;
        }
        if (val.absaetze.includes(term) || (val.paragraph + val.gesetzname + val.name).includes(term)) {
          res.push(val);
        }
      });
    } catch (e) {
      if (e != BreakException) {
        console.log("error: ", e);
      }
    }
    console.log(res);
    setResults(res);
  }, 300);

  const getHighlighted = (text: string) => {
    const parts = text.split(new RegExp(`(${searchterm})`, 'gi'));
    return <p className='whitespace-pre-wrap'>{parts.map((part, inde) => part.toLowerCase() === searchterm.toLowerCase() ? <b key={inde} className='text-red-500'>{part}</b> : part)}</p>;

  };
  const handleRescount = (e: string): void => {
    const n = parseInt(e) || 0;
    console.log(n);
    setResCount(n);
  };
  // TODO: MAKE THEM INTO THEIR PROPER COMPONENTS OR REPLACE WITH SHADCN OR FLUENTUI
  return (
    <div className="flex flex-col justify-center text-neutral-200 items-center h-screen w-screen overflow-x-hidden">
      <SearchComp rescount={rescount} handleSearch={handleSearch} handleRescount={handleRescount} />
      <div className="flex-5/6 flex flex-col bg-slate-900 w-full h-full justify-center items-center overflow-y-auto">
      </div>

    </div>
  );
}

