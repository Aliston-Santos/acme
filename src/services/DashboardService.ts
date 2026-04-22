import prisma from "@/lib/prisma";
import {DashboardMetrics} from "@/types";

export async function getDashboardMetrics (): Promise<DashboardMetrics>{
	const [
        customerCount,
        invoiceCount, 
        pendente, 
        pago,
    revenue
    ] = await prisma.$transaction([
        prisma.customer.count(),
        prisma.invoice.count(),
        prisma.invoice.aggregate({
	        _sum: {amount:true},
	        _count: {id: true},
	        where: {status: 'PENDENTE'}
        }),
        prisma.invoice.aggregate({
	        _sum: {amount:true},
	        _count: {id: true},
	        where: {status: 'PAGO'}
         }),
         prisma.revenue.findMany({
	        orderBy: {month: 'asc'}
        })
    ]); 

    const MONTH_ORDER = ['Jan','Fev', 'Mar','Abr','Mai', 'Jun', 'Jul', 'Ago','Set', 'Out', 'Nov', 'Dez'];


    const sortedRevenue = [...revenue].sort(
    (a,b) => MONTH_ORDER.indexOf(a.month) - MONTH_ORDER.indexOf(b.month)
    ); 


    return{
    customerCount,
    invoiceCount,
    totalPendente: pendente._sum.amount ?? 0,
    totalPago: pago._sum.amount ?? 0,
    countPendente: pendente._count.id,
    countPago: pendente._count.id,
    revenue
};
};
