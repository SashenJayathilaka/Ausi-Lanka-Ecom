import { OrderStatusPieChart } from "./analyticsPage";
import { DeliveryMethodBarChart } from "./analyticsPage/DeliveryMethodBarChart";
import { DistrictSalesBarChart } from "./analyticsPage/DistrictSalesBarChart";
import { MonthlySalesBarChart } from "./analyticsPage/MonthlySalesBarChart";
import { RetailerSalesPieChart } from "./analyticsPage/RetailerSalesPieChart";

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order Analytics</h1>
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OrderStatusPieChart />
          <DeliveryMethodBarChart />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RetailerSalesPieChart />
          <DistrictSalesBarChart />
        </div>
        <MonthlySalesBarChart />
      </div>
    </div>
  );
}
