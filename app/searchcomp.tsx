import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SearchProps {
  rescount: number;
  handleSearch: (term: string) => void;
  handleRescount: (e: string) => void;
}

export default function SearchComp(props: SearchProps) {

  return (
    <div className="flex-1/6 bg-neutral-600 w-full flex flex-row justify-center items-center">
      <div className='w-1/2 h-full flex flex-col justify-center'>
        <Label htmlFor='search'>Suche:</Label>
        <Input type="text" id="search" placeholder="search..." onChange={(e) => props.handleSearch(e.target.value)}
          className="w-full bg-neutral-800 mt-0.5"
        />
      </div>
      <div className='flex flex-col w-1/12 h-full justify-center bg-neutral-600 ml-4'>
        <Label htmlFor='resnum'>count</Label>
        <Input type='number' onChange={(e) => props.handleRescount(e.target.value)} value={props.rescount} id="resnum" className='w-full mt-0.5 bg-neutral-800' />


      </div>
    </div>);
}
