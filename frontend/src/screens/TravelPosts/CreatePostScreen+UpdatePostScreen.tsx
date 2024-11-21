import React from "react";
import {observer} from "mobx-react-lite";
import {CreateOrUpdatePostScreenVmProvider, useCreateOrUpdatePostScreenVm,} from "./CreateOrUpdatePostScreenVm.tsx";
import {PageRoot} from "@/screens/PageRoot.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Switch} from "@/components/ui/switch.tsx";
import {PageHeader} from "@/components/PageHeader.tsx";
import {PlusIcon} from "@radix-ui/react-icons";
import {DeleteIcon} from "lucide-react";
import {clamp} from "@/lib/utils.ts";

interface IProps {
}

export const CreatePostScreen: React.FC<IProps> = observer((props) => {
  return (
    <CreateOrUpdatePostScreenVmProvider postId={null}>
      <CreatePostScreenImpl {...props} />
    </CreateOrUpdatePostScreenVmProvider>
  );
});

export const UpdatePostScreen: React.FC<IProps & { postId: string }> = observer(
  (props) => {
    return (
      <CreateOrUpdatePostScreenVmProvider postId={props.postId}>
        <UpdatePostScreenImpl {...props} />
      </CreateOrUpdatePostScreenVmProvider>
    );
  },
);

const CreatePostScreenImpl: React.FC<IProps> = observer((props) => {
  const vm = useCreateOrUpdatePostScreenVm();
  return (
    <PageRoot>
      <PageHeader>Создание Записи</PageHeader>
      <div className="flex flex-col gap-3">
        <PostForm/>
        <Button onClick={vm.submit}>Опубликовать</Button>
      </div>
    </PageRoot>
  );
});

const UpdatePostScreenImpl: React.FC<IProps> = observer((props) => {
  const vm = useCreateOrUpdatePostScreenVm();
  return (
    <PageRoot>
      <PageHeader>Редактирование Записи</PageHeader>
      {!vm.isLoading ? (
        <div className="flex flex-col gap-3">
          <PostForm/>
          <Button onClick={vm.submit}>Update Post</Button>
        </div>
      ) : (
        <div>Загрузка...</div>
      )}
    </PageRoot>
  );
});

const PostForm = observer(() => {
  const vm = useCreateOrUpdatePostScreenVm();
  const clampRating = (rating: number) => {
    return clamp(rating, 1, 5);
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <Label>Заголовок</Label>
        <Input value={vm.title} onChange={(e) => (vm.title = e.target.value)}/>
      </div>
      <div className="flex flex-col gap-3">
        <Label>Цена (руб.)</Label>
        <NumberInput
          value={vm.cost}
          onChange={(value) => (vm.cost = Math.max(0, value))}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label>Удобство передвижения (от 1 до 5)</Label>
        <NumberInput
          value={vm.transportationRating}
          onChange={(value) => (vm.transportationRating = clampRating(value))}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label>Безопасность (от 1 до 5)</Label>
        <NumberInput
          value={vm.safetyRating}
          onChange={(value) => (vm.safetyRating = clampRating(value))}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label>Населенности (от 1 до 5)</Label>
        <NumberInput
          value={vm.overcrowdingRating}
          onChange={(value) => (vm.overcrowdingRating = clampRating(value))}
        />
      </div>
      <div className="flex flex-col gap-3">
        <Label>Растительность (от 1 до 5)</Label>
        <NumberInput
          value={vm.natureRating}
          onChange={(value) => (vm.natureRating = clampRating(value))}
        />
      </div>
      <div className="flex flex-col items-start gap-3">
        <Label>Места культурного наследия</Label>
        <div className={"flex flex-row gap-4 w-full"}>
          <Input
            className={"flex-1"}
            value={vm.culturalHeritageSiteInProgress}
            onChange={(e) => (vm.culturalHeritageSiteInProgress = e.currentTarget.value)}
          />
          <Button
            className={"aspect-square"}
            variant={"outline"}
            onClick={vm.addCulturalHeritageSite}
          >
            <PlusIcon/>
          </Button>
        </div>
        {[...vm.culturalHeritageSites].map((site) => (
          <div key={site} className={"flex flex-row items-center gap-2"}>
            <div className={"font-semibold"}>{site}</div>
            <Button
              className={"aspect-square"}
              variant={"outline"}
              onClick={() => vm.removeCulturalHeritageSite(site)}
            >
              <DeleteIcon/>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
});

const NumberInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({value, onChange}) => {
  return (
    <Input
      value={value.toString()}
      onChange={(e) => {
        const parsed = parseInt(e.target.value);
        onChange(isNaN(parsed) ? 0 : parsed);
      }}
    />
  );
};

