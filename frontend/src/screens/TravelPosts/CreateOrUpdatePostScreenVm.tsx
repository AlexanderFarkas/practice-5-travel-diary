import React, {useMemo} from "react";
import {makeAutoObservable,} from "mobx";
import {alertOnError, useVm} from "@/lib/utils.ts";
import {SchemaCreateTravelPostDto} from "@/gen/schema";
import {api} from "@/api.ts";
import {useLocation} from "wouter";
import {Navigate} from "wouter/memory-location";
import {useStores} from "@/screens/App.tsx";

export class CreateOrUpdatePostScreenVm {
  constructor(
    private postId: string | null,
    private navigate: Navigate,
  ) {
    makeAutoObservable(this, {}, {autoBind: true});
    this._init();
  }

  isLoading = false;

  title = "";
  cost: number = 0;
  transportationRating: number = 5;
  safetyRating: number = 5;
  overcrowdingRating: number = 0;
  natureRating: number = 5;

  culturalHeritageSites: Set<string> = new Set();
  culturalHeritageSiteInProgress = "";

  addCulturalHeritageSite() {
    this.culturalHeritageSites.add(this.culturalHeritageSiteInProgress);
    this.culturalHeritageSiteInProgress = "";
  }

  removeCulturalHeritageSite(tag: string): void {
    this.culturalHeritageSites.delete(tag);
  }


  submit = async () => {
    const post: SchemaCreateTravelPostDto = {
      title: this.title,
      cost: this.cost,
      transportation_rating: this.transportationRating,
      safety_rating: this.safetyRating,
      overcrowding_rating: this.overcrowdingRating,
      nature_rating: this.natureRating,
      cultural_heritage_sites: Array.from(this.culturalHeritageSites),
    };
    await alertOnError(async () => {
      if (this.postId) {
        await api.PUT("/travel_posts/{post_id}", {
          params: {path: {post_id: this.postId}},
          body: post,
        });
      } else {
        await api.POST("/travel_posts/", {body: post});
      }
    });
    this.navigate("/profile");
  };

  private _init = async () => {
    if (this.postId) {
      this.isLoading = true;
      try {
        const postId = this.postId;
        await alertOnError(async () => {
          const {data} = await api.GET("/travel_posts/{post_id}", {
            params: {
              path: {post_id: postId},
            },
          });

          const post = data!;
          this.title = post.title;
          this.cost = post.cost;
          this.transportationRating = post.transportation_rating;
          this.safetyRating = post.safety_rating;
          this.overcrowdingRating = post.overcrowding_rating;
          this.natureRating = post.nature_rating;
          this.culturalHeritageSites = new Set(post.cultural_heritage_sites);
        });
      } finally {
        this.isLoading = false;
      }
    }
  };
}

const ctx = React.createContext<CreateOrUpdatePostScreenVm | null>(null);

export const CreateOrUpdatePostScreenVmProvider: React.FC<{
  children: React.ReactNode;
  postId: string | null;
}> = ({children, postId}) => {
  const {} = useStores();
  const [_, navigate] = useLocation();
  const vm = useMemo(
    () => new CreateOrUpdatePostScreenVm(postId, navigate),
    [],
  );
  return <ctx.Provider value={vm}>{children}</ctx.Provider>;
};

export const useCreateOrUpdatePostScreenVm = () => useVm(ctx);
