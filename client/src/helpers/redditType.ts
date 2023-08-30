export type RedditTypeObject = TextType | CommentType | ExternalType | ImageType | GalleryImageType

export type RedditObject = {
    postType: 'text'
    typeData: TextType,
} | {
    postType: 'comment',
    typeData: CommentType
} | {
    postType: 'external',
    typeData: ExternalType
} | {
    postType: 'image',
    typeData: ImageType
} | {
    postType: 'galleryImage',
    typeData: GalleryImageType
}

type PostType = "text" | "comment" | "external" | "image" | "galleryImage"

type TextType = {
    title: string,
    selftext: string,
    subreddit: string,
    selftext_html: string,
    post_url: string,
}

type CommentType = {
    title: string,
    post_type: PostType,
    body: string,
    subreddit: string,
    post_url: string
}

type ExternalType = {
    title: string,
    post_type: PostType,
    post_url: string,
    subreddit: string,
    externalLink: string,
}

type ImageType = {
    title: string, post_type: PostType, post_url: string, imageLink: string, subreddit: string
}

type GalleryImageType = {
    title: string, post_type: PostType, post_url: string, mediaArray: string[], subreddit: string
}
