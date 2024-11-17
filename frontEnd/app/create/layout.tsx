import { PageTransition } from "@/components/page-transaction";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTransition>
      <section>{children}</section>
      
    </PageTransition>
  );
}
