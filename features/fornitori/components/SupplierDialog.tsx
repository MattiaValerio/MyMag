"use client"

import { useMemo } from "react"
import { z } from "zod"
import { FormWrapper } from "@/components/forms/FormWrapper"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export type SupplierFormValues = z.infer<typeof supplierSchema>

export const supplierSchema = z.object({
  name: z.string().min(1, "Obbligatorio"),
  // Contacts
  email: z.string().email("Email non valida").optional().or(z.literal("")),
  phone: z.string().optional(),
  phone2: z.string().optional(),
  mobile: z.string().optional(),
  website: z.string().url("URL non valido").optional().or(z.literal("")),
  // Anagrafici
  address: z.string().optional(),
  city: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  taxCode: z.string().optional(),
  vatNumber: z.string().optional(),
  // Commerciali
  paymentTerms: z.string().optional(),
  paymentMethod: z.string().optional(),
  iban: z.string().optional(),
  sdiCode: z.string().optional(),
  pecEmail: z.string().email("Email PEC non valida").optional().or(z.literal("")),
  // Allow empty string in form, normalized later
  defaultDiscount: z.union([z.coerce.number().min(0).max(100), z.literal("")]).optional(),
  leadTimeDays: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  // Notes
  notes: z.string().optional(),
})

export type SupplierDialogMode = "create" | "edit" | "view"

export function SupplierDialog({
  open,
  onOpenChange,
  mode = "create",
  initialValues,
  onSubmit,
  loading = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode?: SupplierDialogMode
  initialValues?: Partial<SupplierFormValues>
  onSubmit?: (values: SupplierFormValues) => Promise<void> | void
  loading?: boolean
}) {
  const defaults: SupplierFormValues = useMemo(
    () => ({
      name: initialValues?.name ?? "",
      email: initialValues?.email ?? "",
      phone: initialValues?.phone ?? "",
      phone2: initialValues?.phone2 ?? "",
      mobile: initialValues?.mobile ?? "",
      website: initialValues?.website ?? "",
      address: initialValues?.address ?? "",
      city: initialValues?.city ?? "",
      zip: initialValues?.zip ?? "",
      country: initialValues?.country ?? "",
      taxCode: initialValues?.taxCode ?? "",
      vatNumber: initialValues?.vatNumber ?? "",
      paymentTerms: initialValues?.paymentTerms ?? "",
      paymentMethod: initialValues?.paymentMethod ?? "",
      iban: initialValues?.iban ?? "",
      sdiCode: initialValues?.sdiCode ?? "",
      pecEmail: initialValues?.pecEmail ?? "",
      defaultDiscount: (initialValues as any)?.defaultDiscount ?? "",
      leadTimeDays: (initialValues as any)?.leadTimeDays ?? "",
      contactName: initialValues?.contactName ?? "",
      contactRole: initialValues?.contactRole ?? "",
      notes: initialValues?.notes ?? "",
    }),
    [initialValues]
  )

  const readOnly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <div className="flex h-full flex-col">
          <DialogHeader className="px-6 py-4 shrink-0">
          <DialogTitle>
            {mode === "create" && "Nuovo fornitore"}
            {mode === "edit" && "Modifica fornitore"}
            {mode === "view" && "Dettagli fornitore"}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 flex min-h-0 flex-1 flex-col">
          <FormWrapper schema={supplierSchema} defaultValues={defaults} onSubmit={(values) => onSubmit?.(values)}>
            <div className="flex min-h-0 flex-1 flex-col">
            <Tabs defaultValue="anagrafica" className="flex min-h-0 flex-1 flex-col">
              <TabsList className="flex w-full gap-2 overflow-x-auto whitespace-nowrap">
                <TabsTrigger className="shrink-0" value="anagrafica">Anagrafica</TabsTrigger>
                <TabsTrigger className="shrink-0" value="commerciali">Commerciali</TabsTrigger>
                <TabsTrigger className="shrink-0" value="contatti">Contatti</TabsTrigger>
                <TabsTrigger className="shrink-0" value="note">Note</TabsTrigger>
              </TabsList>

              <div className="mt-2 min-h-0 flex-1 overflow-y-auto md:border md:rounded-md md:p-4 p-0">
              <TabsContent value="anagrafica" className="pt-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ragione sociale</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="Nome azienda" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="vatNumber" render={({ field }) => (
                    <FormItem>
                      <FormLabel>P.IVA</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="taxCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Codice fiscale</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="address" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Indirizzo</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="Via/Piazza e numero" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="zip" render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="city" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Città</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nazione</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                </div>
              </TabsContent>

              <TabsContent value="commerciali" className="pt-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField name="paymentTerms" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termini di pagamento</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="es. 30/60 gg d.f." />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="paymentMethod" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metodo di pagamento</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="Bonifico, RID, ecc." />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="iban" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>IBAN</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="defaultDiscount" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sconto (%)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} inputMode="decimal" placeholder="0-100" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="leadTimeDays" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead time (giorni)</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} inputMode="numeric" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="sdiCode" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cod. SDI</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="pecEmail" render={({ field }) => (
                    <FormItem>
                      <FormLabel>PEC</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </TabsContent>

              <TabsContent value="contatti" className="pt-1">
                <div className="grid gap-3 sm:grid-cols-2">
                  <FormField name="contactName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referente</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="Nome referente" />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="contactRole" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ruolo</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="Commerciale, Acquisti, ecc." />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="phone2" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono 2</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="mobile" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cellulare</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} />
                      </FormControl>
                    </FormItem>
                  )} />
                  <FormField name="website" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Sito web</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly={readOnly} placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
              </TabsContent>

              <TabsContent value="note" className="pt-1">
                <FormField name="notes" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea {...field} readOnly={readOnly} rows={6} />
                    </FormControl>
                  </FormItem>
                )} />
              </TabsContent>
              </div>
            </Tabs>
            {(mode === "create" || mode === "edit") && (
              <DialogFooter className="mt-2 shrink-0 border-t bg-background px-6 py-3">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                  Annulla
                </Button>
                <Button type="submit" disabled={loading}>
                  {mode === "create" ? "Crea fornitore" : "Salva"}
                </Button>
              </DialogFooter>
            )}
            </div>

          </FormWrapper>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
