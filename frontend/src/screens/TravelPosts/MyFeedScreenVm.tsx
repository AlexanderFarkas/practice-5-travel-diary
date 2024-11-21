import React, {useMemo} from "react";
import {makeAutoObservable,} from "mobx";
import {alertOnError, useVm} from "@/lib/utils.ts";
import {api} from "@/api.ts";
import {useStores} from "@/screens/App.tsx";
import {useLocation} from "wouter";
import {SchemaTravelPostDto} from "@/gen/schema";

export type FeedType = "all" | "subscriptions";

export class MyFeedScreenVm {
  constructor() {
    makeAutoObservable(this);
    this.refresh();
  }

  isLoading = false;
  travelPosts = Array<SchemaTravelPostDto>();

  async refresh() {
    this.isLoading = true;
    try {
      const {data} = await alertOnError(() => api.GET("/travel_posts/"));
      this.travelPosts = data!;
    } finally {
      this.isLoading = false;
    }
  }
}

const ctx = React.createContext<MyFeedScreenVm | null>(null);

export const MyFeedScreenVmProvider: React.FC<{
  children: React.ReactNode;
}> = ({children}) => {
  const {} = useStores();
  const vm = useMemo(() => new MyFeedScreenVm(), []);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useMyFeedScreenVm = () => useVm(ctx);
