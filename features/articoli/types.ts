import { type Article } from "@prisma/client"

export type ArticleRow = Pick<Article, "id" | "code" | "description" | "price" | "stock">
