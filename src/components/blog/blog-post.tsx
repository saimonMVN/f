import type {FC} from 'react';
import {useRouter} from 'next/router';
import {useTranslation} from 'next-i18next';
import Alert from '@components/ui/alert';
import ProductCardLoader from '@components/ui/loaders/product-card-loader';
import cn from 'classnames';
import {useBlogPostQuery} from '@framework/blog/get-blog-post';
import {LIMITS} from '@framework/utils/limits';
import {GrNext, GrPrevious} from "react-icons/gr";
import {useState} from "react";
import BlogPostCard from "@components/blog/blog-post-card";

interface blogGridProps {
    className?: string;
}

export const BlogPost: FC<blogGridProps> = ({className = ''}) => {
    const {t} = useTranslation('common');
    const {query} = useRouter();

    const {data: dataPost, isLoading, error} = useBlogPostQuery({});
    //console.log(dataPost?.title);
    return (
        <>
            <div
                className={cn(
                    'blog-post w-full ',
                    className
                )}
            >
                {error ? (
                    <div className="col-span-full ">
                        <Alert message={error?.message}/>
                    </div>
                ) : (
                   <BlogPostCard key={`blog--post`} blog={dataPost}/>
                )}
            </div>

        </>
    );
};
