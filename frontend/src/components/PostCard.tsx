import {observer} from "mobx-react-lite";
import {Card} from "@/components/ui/card.tsx";
import {TypographyH2} from "@/components/typography.tsx";
import {Link} from "wouter";
import React from "react";
import {Separator} from "@/components/ui/separator.tsx";
import {SchemaTravelPostDto} from "@/gen/schema";

export const PostCard = observer(
  ({post, trailing}: { post: SchemaTravelPostDto; trailing?: React.ReactNode }) => {
    return (
      <Card>
        <div>
          <TypographyH2 className={"p-2"}>
            {
              <div className={"flex flex-row gap-2 justify-between"}>
                <div className={"flex items-start flex-col"}>
                  <div>{post.title}</div>
                  <Link
                    to={`/profile/${post.user.id}`}
                    className={"text-xs underline"}
                  >
                    <div className={"text-xs underline"}>
                      Автор: {post.user.username}
                    </div>
                  </Link>
                </div>
                {trailing}
              </div>
            }
          </TypographyH2>
          <div className={"flex flex-col gap-1 m-3"}>
          <div className={"font-bold"}>Цена (руб.): {post.cost}</div>
          <div className={"flex flex-col gap-1 ml-2"}>
            <div>Удобство передвижения - {post.transportation_rating}</div>
            <div>Безопасность - {post.safety_rating}</div>
            <div>Населенность - {post.overcrowding_rating}</div>
            <div>Растительность - {post.nature_rating}</div>
          </div>
          </div>
          {post.cultural_heritage_sites.length > 0 && (
            <>
              <Separator/>
              <div className={"flex flex-row flex-wrap gap-2 p-2"}>
                {post.cultural_heritage_sites.map((site) => (
                  <div
                    className={"font-bold px-2 py-1 bg-purple-400 rounded-sm"}
                  >
                    {site}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Card>
    );
  },
);