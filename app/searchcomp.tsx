import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { lawdata } from "./page";
import { Dispatch, SetStateAction } from "react";

interface SearchProps {
  rescount: number;
  data: lawdata[];
  setError: Dispatch<SetStateAction<boolean>>;
  setResults: Dispatch<SetStateAction<lawdata[]>>;
  setResCount: Dispatch<SetStateAction<number>>;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

const BreakException = {};

export default function SearchComp(props: SearchProps) {
  const handleSearch = useDebouncedCallback((term: string) => {
    if (props.data.length == 0) {
      console.log("NO DATA LOADED");
      props.setError(true)
      return;
    }
    if (term == "") {
      props.setResults([])
      return;
    }
    props.setSearchTerm(term)
    const res: lawdata[] = [];
    try {

      props.data.forEach((val) => {
        if (res.length >= props.rescount) {
          throw BreakException;
        }
        if (val.absaetze.includes(term) || (val.paragraph + val.gesetzname + val.name).includes(term)) {
          res.push(val)
        }
      });
    } catch (e) {
      if (e != BreakException) {
        console.log("error: ", e);
      }
    }
    console.log(res);
    props.setResults(res);
  }, 300);

  const handleRescount = (e: string): void => {
    const n = parseInt(e) || 0;
    console.log(n);
    props.setResCount(n);
  }

  return (
    <div className="flex-1/6 bg-neutral-600 w-full flex flex-row justify-center items-center">
      <div className='w-1/2 h-full flex flex-col justify-center'>
        <Label htmlFor='search'>Suche:</Label>
        <Input type="text" id="search" placeholder="search..." onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-neutral-800 mt-0.5"
        />
      </div>
      <div className='flex flex-col w-1/12 h-full justify-center bg-neutral-600 ml-4'>
        <Label htmlFor='resnum'>count</Label>
        <Input type='number' onChange={(e) => handleRescount(e.target.value)} value={props.rescount} id="resnum" className='w-full mt-0.5 bg-neutral-800' />
      </div>
    </div>);
}
