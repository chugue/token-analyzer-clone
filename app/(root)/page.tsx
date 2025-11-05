"use client";

import PickedTickerMeta from "@/components/root/PickedTickerMeta";
import SuggestionCard from "@/components/root/suggestions/SuggestionCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import useDebouncedSearch from "@/lib/hooks/use-debounced-search";
import useTickerStore from "@/lib/store/ticker-store";
import { Search } from "lucide-react";

export default function Home() {
  const { ticker, setTicker, pickedTicker, suggestions } = useTickerStore();

  useDebouncedSearch(ticker, 500);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">Token Social Analyzer</h1>
        <p className="text-lg font-light">
          AI-powered Twitter analysis for crypto tokens
        </p>
      </div>
      <Card className="flex flex-col w-full max-w-md gap-1 shadow-lg">
        <CardHeader className="text-start">
          <CardTitle className="text-md font-medium">Token Symbol</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <InputGroup>
            <InputGroupInput
              placeholder="BTC, ETH, SOL.. "
              className="focus:ring-blue-500 focus:border-blue-500 uppercase relative "
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <SuggestionCard />
          </InputGroup>
          {pickedTicker && <PickedTickerMeta />}
          <Button className="w-full" disabled={!pickedTicker}>
            Generate Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
