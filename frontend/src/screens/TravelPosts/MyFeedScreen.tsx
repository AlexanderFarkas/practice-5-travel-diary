import React from "react";
import { observer } from "mobx-react-lite";
import {
  FeedType,
  MyFeedScreenVmProvider,
  useMyFeedScreenVm,
} from "./MyFeedScreenVm.tsx";
import { PageRoot } from "@/screens/PageRoot.tsx";
import { Button } from "@/components/ui/button.tsx";
import { ExitIcon, PersonIcon, PlusIcon } from "@radix-ui/react-icons";
import { TypographyH2 } from "@/components/typography.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Link, useLocation } from "wouter";
import { useStores } from "@/screens/App.tsx";
import { PageHeader } from "@/components/PageHeader.tsx";
import { PostCard } from "@/components/PostCard.tsx";
import { DeleteIcon } from "lucide-react";

interface IProps {}

export const MyFeedScreen: React.FC<IProps> = observer((props) => {
  return (
    <MyFeedScreenVmProvider>
      <MyFeedScreenImpl {...props} />
    </MyFeedScreenVmProvider>
  );
});

const MyFeedScreenImpl: React.FC<IProps> = observer((props) => {
  const authStore = useStores().authStore;
  const [_, navigate] = useLocation();
  const vm = useMyFeedScreenVm();
  return (
    <PageRoot>
      <PageHeader>
        <div className={"flex items-center flex-row gap-3"}>
          <div className={"text-3xl font-bold"}>Лента</div>
          <Button
            className={"aspect-square"}
            variant={"outline"}
            onClick={() => navigate("/create_post")}
          >
            <PlusIcon />
          </Button>
          <Button
            className={"aspect-square"}
            variant={"outline"}
            onClick={() => navigate("/profile/" + authStore.user!.id)}
          >
            <PersonIcon />
          </Button>
        </div>
      </PageHeader>
      <Separator />
      {vm.isLoading ? (
        <div className={"w-full text-center"}>Загрузка...</div>
      ) : (
        <div className={"flex flex-col gap-3"}>
          {vm.travelPosts.length === 0 && (
            <div className={"w-full text-center"}>Записи не найдены</div>
          )}
          {vm.travelPosts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      )}
    </PageRoot>
  );
});
