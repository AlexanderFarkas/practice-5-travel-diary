import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { UserProfileVmProvider, useUserProfileVm } from "./UserProfileVm";
import { PageRoot } from "@/screens/PageRoot.tsx";
import { PageHeader } from "@/components/PageHeader.tsx";
import { SchemaUserDto, SchemaUserWithProfileDto } from "@/gen/schema";
import { PostCard } from "@/components/PostCard.tsx";
import { Button, buttonVariants } from "@/components/ui/button.tsx";
import { DeleteIcon, EditIcon, ShareIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { api } from "@/api.ts";
import { TrashIcon } from "@radix-ui/react-icons";
import { Link, useLocation, useRouter } from "wouter";
import { cn } from "@/lib/utils.ts";

interface IProps {
  userId: string;
}

export const UserProfile: React.FC<IProps> = observer((props) => {
  return (
    <UserProfileVmProvider userId={props.userId}>
      <UserProfileImpl {...props} />
    </UserProfileVmProvider>
  );
});

const UserProfileImpl: React.FC<IProps> = observer((props) => {
  const vm = useUserProfileVm();
  return (
    <PageRoot>
      <PageHeader>
        <div className={"text-xl text-center truncate text-ellipsis"}>
          {vm.isLoading ? "..." : `${vm.user!.username} - Дневник`}
        </div>
      </PageHeader>
      {vm.isLoading ? <div>Загрузка...</div> : <Content user={vm.user!} />}
    </PageRoot>
  );
});

const Content = observer(({ user }: { user: SchemaUserWithProfileDto }) => {
  const vm = useUserProfileVm();
  const [_, navigate] = useLocation();

  return (
    <div className={"flex flex-col gap-4"}>
      {vm.travelPosts.map((post) => (
        <PostCard
          post={post}
          trailing={
            <div className={"flex flex-row gap-1"}>
              {vm.isMyProfile && (
                <Button
                  className={"aspect-square"}
                  variant={"outline"}
                  onClick={() => navigate("/edit_post/" + post.id)}
                >
                  <EditIcon />
                </Button>
              )}
            </div>
          }
        />
      ))}
    </div>
  );
});
