import AppLayout from "@/components/AppLayout/applayout";
import RentalProfilePage from "@/components/rental/RentalProfilePage";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase/supabase";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: {
    profile_id: string;
  };
};

export default async function Page({ params }: Props) {
  const rental_id = params.profile_id;

  const { data: profile } = await supabase
    .from("rental_profiles")
    .select("*")
    .eq("profile_id", rental_id)
    .single();

  if (!profile) return <div>Profile not found</div>;

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <Link href="/rent-a-friend">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Rentals
          </Button>
        </Link>
        <RentalProfilePage profile={profile} rental_id={rental_id} />
      </div>
    </AppLayout>
  );
}
