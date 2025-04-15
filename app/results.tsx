import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { lawdata } from "./page";

interface ResultProps {
  err: boolean;
  results: lawdata[];
  searchterm: string;
}
export function Results(props: ResultProps) {
  function getHighlighted(absaetze: string): React.ReactNode {
    const parts = absaetze.split(new RegExp(`(${props.searchterm})`, 'gi'));
    return <p className='whitespace-pre-wrap'>{parts.map((part, inde) => part.toLowerCase() === props.searchterm.toLowerCase() ? <b key={inde} className='text-red-500'>{part}</b> : part)}</p>;
  }

  return (
    <ScrollArea className='w-full h-full'>

      {
        props.results.length == 0 ?
          (props.err ?
            (<div className='w-full flex mt-2 justify-center'>DATEN NICHT GELADEN</div>) :
            (<div className='w-full flex mt-2 justify-center'>Keine Ergebnisse</div>)) :
          props.results.map(val => (
            <Card key={val.id} className='bg-neutral-800 border-neutral-900 text-neutral-200 mb-1 last:mb-0'>
              <CardHeader>
                <CardTitle>{val.gesetzname + ' ' + val.paragraph}</CardTitle>
                <CardDescription>{val.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {getHighlighted(val.absaetze)}
              </CardContent>
              <CardFooter>
                <p className='text-blue-300'>Mehr Lesen</p>
              </CardFooter>

            </Card>
          ))
      }
    </ScrollArea>

  );
}
