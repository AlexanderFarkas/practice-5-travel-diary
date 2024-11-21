import React, {useMemo} from "react";
import {makeAutoObservable,} from "mobx";
import {AuthStore} from "@/screens/Stores/AuthStore.ts";
import {useStores} from "@/screens/App.tsx";
import {alertOnError, useVm} from "@/lib/utils.ts";
import {api} from "@/api.ts";
import {SchemaTravelPostDto, SchemaUserWithProfileDto,} from "@/gen/schema";

export class UserProfileVm {
  constructor(
    private userId: string,
    private authStore: AuthStore,
  ) {
    makeAutoObservable(this);
    this._init();
  }

  user: SchemaUserWithProfileDto | null = null;
  travelPosts: SchemaTravelPostDto[] = [];
  isLoading = false;

  get isMyProfile() {
    return this.userId === this.authStore.userId;
  }

  _init = async () => {
    this.isLoading = true;
    try {
      await alertOnError(async () => {
        const {data: userData} = await api.GET("/users/{user_id}", {
          params: {
            path: {
              user_id: this.userId,
            },
          },
        });
        this.user = userData!;
        this.travelPosts = userData!.travel_posts;
      })

    } finally {
      this.isLoading = false;
    }
  };

}

const ctx = React.createContext<UserProfileVm | null>(null);

export const UserProfileVmProvider: React.FC<{
  children: React.ReactNode;
  userId: string;
}> = ({children, userId}) => {
  const {authStore} = useStores();
  const vm = useMemo(() => new UserProfileVm(userId, authStore), []);
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useUserProfileVm = () => useVm(ctx);
