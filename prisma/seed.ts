import {PrismaClient, InvoiceStatus} from '@prisma/client';
import bcrypt from 'bcryptjs';
import { log } from 'console';
import { Acme } from 'next/font/google';

const prisma = new PrismaClient();

async function main(){
    console.log('iniciando população do banco de dados ...');

    const password = await bcrypt.hash('password' , 10);

    const user = prisma.user.upsert({
        where: {email: 'admin@acme.com'},
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@acme.com',
            password: password 
        }
    })

    console.log ('Usuári criado com sucesso.');

    const customer_data = [{
        name: 'Alex Bessa',
        email: 'alex@email.com',
        imageUrl: 'https://ui-avatars/api/?name=Alex+Bessa&background=random'
    },{
        name: 'valdiana',
        email: 'valdina@email.com',
        imageUrl: 'https://ui-avatars/api/?name=Valdiana+Bessa&background=random'
    },{
        name: 'Timóteio Bessa',
        email: 'timoteo@email.com',
        imageUrl: 'https://ui-avatars/api/?name=Timoteo+Bessa&background=random'
    }];
    const customers = [];

    for (const data of customer_data){
        const customer = await prisma.customer.upsert({
            where: {email: data.email},
            update: {},
            create: data
        });

        customers.push(customer);
        console.log(`cliente criado: ${customer.name}`);
    }

    const invoiceData = [
        {
            amount: 656542, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-3-05', 
            customer: customers[0]
        },{
            amount: 15355, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-23-05', 
            customer: customers[1]
        },{
            amount: 34534, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-30-05', 
            customer: customers[2]
        },{
            amount: 96345, 
            status: InvoiceStatus.PAGO,
            date: '2026-21-05', 
            customer: customers[2]
        },{
            amount: 39734, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05', 
            customer: customers[1]
        },{
            amount: 7646, 
            status: InvoiceStatus.PAGO,
            date: '2026-13-05', 
            customer: customers[0]
        },{
            amount: 2423, 
            status: InvoiceStatus.PAGO,
            date: '2026-10-05', 
            customer: customers[0]
        },{
            amount: 432423, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-07-05', 
            customer: customers[1]
        },{
            amount: 865876, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-04-05', 
            customer: customers[2]
        },{
            amount: 4324, 
            status: InvoiceStatus.PAGO,
            date: '2026-17-05', 
            customer: customers[2]
        },{
            amount: 654645, 
            status: InvoiceStatus.PENDENTE,
            date: '2026-02-05', 
            customer: customers[1]
        },{
            amount: 62623, 
            status: InvoiceStatus.PAGO,
            date: '2026-18-05', 
            customer: customers[0]
        }]

    for (const data of invoiceData ){
        await prisma.invoice.create({
            data: {
                amount: data.amount,
                status: data.status,
                date: new Date(data.date),
                customerId: data.customer.id,
            }
        })
    }

    console.log(`${invoiceData.length} faturas criadas.`)

    const revenueData =[{
        month: 'Jan',
        revenue: 151554
    },{
        month: 'Fev',
        revenue: 1243243
    },{
        month: 'Mar',
        revenue: 65454
    },{
        month: 'Abr',
        revenue: 87079
    },{
        month: 'Mai',
        revenue: 83963
    },{
        month: 'Jun',
        revenue: 543640
    },{
        month: 'Jul',
        revenue: 754378
    },{
        month: 'Ago',
        revenue: 66542
    },{
        month: 'Set',
        revenue: 63247
    },{
        month: 'Out',
        revenue: 3426462
    },{
        month: 'Nov',
        revenue: 83829383928
    },{
        month: 'Dez',
        revenue: 32743284238
    }
]

    for ( const data of revenueData){
        await prisma.revenue.upsert({
            where:{month: data.month},
            update: {revenue:data.revenue},
            create: data
        })
    }

    console.log('Dados de receita criados')

    console.log('População concluída com sucesso')
}


main()
    .catch((erro) => {
        console.log('Erro ao popular o banco:', erro)
    })

    .finally( async() =>{
        await prisma.$disconnect()
    })