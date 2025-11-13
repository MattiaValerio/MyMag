"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z, ZodTypeAny } from "zod"
import { Form } from "@/components/ui/form"

type FormWrapperProps<TSchema extends ZodTypeAny> = {
  schema: TSchema
  defaultValues: z.infer<TSchema>
  onSubmit: (values: z.infer<TSchema>) => Promise<void> | void
  children: React.ReactNode
}

export function FormWrapper<TSchema extends ZodTypeAny>({ schema, defaultValues, onSubmit, children }: FormWrapperProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v))} className="space-y-4">
        {children}
      </form>
    </Form>
  )
}
