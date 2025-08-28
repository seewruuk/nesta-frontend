import DashboardLayout from "@/components/_layouts/DashboardLayout";

export default function layout({children}) {
    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>

    );
}

export const metadata = {
    title: 'Dashboard - Nesta',
    description: 'Zarządzaj swoimi ofertami i kontem na Nesta.',
}