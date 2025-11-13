"use client"

import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { Control, FieldValues, Path } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DatePickerFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label?: string
  description?: string
  placeholder?: string
  disabled?: boolean
}

export function DatePickerField<T extends FieldValues>({ control, name, label, description, placeholder = "Seleziona data", disabled }: DatePickerFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label ? <FormLabel>{label}</FormLabel> : null}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className="w-full justify-start text-left font-normal" disabled={disabled}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? format(field.value as Date, "dd/MM/yyyy") : <span className="text-muted-foreground">{placeholder}</span>}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value as Date | undefined}
                onSelect={(date) => field.onChange(date ?? undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
