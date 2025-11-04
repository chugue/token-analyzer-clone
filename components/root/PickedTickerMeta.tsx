import { TickerMetaData } from "@/lib/types/ticker";
import { Button } from "../ui/button";

const PickedTickerMeta = ({ ticker }: { ticker: TickerMetaData }) => {
  return (
    <div className="flex flex-col gap-2 bg-blue-50  rounded-md border border-blue-200 p-4">
      <div className="flex-row-between">
        <p className="font-medium text-primary">{ticker.ticker}</p>
        <Button
          variant="ghost"
          className="text-xs h-8 px-2 rounded-md text-primary cursor-pointer"
        >
          change
        </Button>
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <p className=" font-medium">
          Name: <span className="text-muted-foreground">{ticker.name}</span>
        </p>
        <p className=" font-medium">
          Slug: <span className="text-muted-foreground">{ticker.slug}</span>
        </p>
        <div className="flex-row-between">
          <p className=" font-medium">
            Source:
            <span className="ml-2 text-[10px] font-bold w-auto whitespace-nowrap px-2 py-1 border border-blue-200 rounded-md bg-white uppercase text-blue-700">
              {ticker.source}
            </span>
          </p>
          <p className=" font-medium">
            Rank: <span className="text-muted-foreground">#{ticker.rank}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PickedTickerMeta;
