import prisma from '@/lib/prisma';
import {
    Invoice,
    CreateInvoiceData,
    UpdateInvoiceData,
    FindAllInvoiceParams,
    PaginatedResponse
} from '@/types';


export async function findAllInvoices(
    params: FindAllInvoiceParams = {}): Promise<PaginatedResponse<Invoice>> {
    const {
        search,
        page = 1,
        limit = 10,
        order = 'desc'
    } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;

    const where = search
        ? {
            customer: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { email: { contains: search, mode: 'insensitive' as const } }
                ]
            }
        }
        : undefined;


    const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            include: {
                customer: {
                    select: {
                        name: true,
                        email: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { date: order },
            take: safeLimit,
            skip

        }),
        prisma.invoice.count({ where })
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: invoices,
        meta: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasMore: safePage < totalPages
        }

    }
}



export async function findInvoiceById(
    id: string
): Promise<Invoice | null> {
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        },
    })

    return invoice;
}



export async function createInvoice(
    data: CreateInvoiceData
): Promise<Invoice> {
    const invoice = await prisma.invoice.create({
        data,
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    })
    return invoice;
}




export async function updateInvoice(
    id: string,
    data: UpdateInvoiceData
): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
        where: {id},
        data,
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    })
    return invoice;

}


export async function deleteInvoice(
	id: string
	
): Promise <void> {
	await prisma.invoice.delete({
	where: {id}
})
}