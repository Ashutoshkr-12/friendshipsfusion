import AppLayout from "@/components/AppLayout/applayout";
import RentalGrid from "@/components/rental/rental";
import { rentalProfiles } from "@/mockdata/data";

const Rent = () => {
  return (
    <AppLayout>
      <div className="container mx-auto py-6 max-w-7xl">
        <h1 className="text-2xl font-bold mb-2 px-4">//here is somehting</h1>

        <p className="text-gray-600 mb-6 px-4">
          Find someone to hang out with, explore the city, or accompany you to
          events
        </p>
        <RentalGrid profiles={rentalProfiles} />
      </div>
    </AppLayout>
  );
};

export default Rent;
