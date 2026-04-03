import {z} from 'zod';

import {
	findAllCustomers,
	findCustomerById,
	CreateCustomer,
	updateCustomer,
	deleteCustomer
} from '@/services/CustomerServices'

import {ApiError} from '@/types'

export const CreateCustomerSchema = z.object({
name: z
	.string({required_error: 'O campo é obrigatório.'}) 
	.min(1, 'O campo não pode estar vazio')
	.max(100, 'O campo deve ter no máximo 100 caracteres.'),	
email: z
	.string({required_error: 'O campo é obrigatório.'})
	.email('o campo possui formato invalido'),
imageUrl:z
	.string({required_error: 'O campo é obrigatório.'})
	.url('o campo possui formato invalido')
	
});


export const UpdateCustomerSchema = CreateCustomerSchema.partial();


export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>



function buildErrorResponse(
  message: string,
  details?: Record<string, string[]>
): ApiError {
  if (details) {
    return { error: message, details };
  }

  return { error: message };
}

export const CustomerController = {
  async getAll(searchParams: URLSearchParams) {
    const search = searchParams.get('search') ?? undefined;

    const customers = await findAllCustomers({ search });

    return { status: 200, body: customers };
  },

  async getById(id: string) {
    const customer = await findCustomerById(id);

    if (!customer) {
      return {
        status: 404,
        body: buildErrorResponse('Cliente não encontrado.'),
      };
    }

    return { status: 200, body: customer };
  },

  async create(data: unknown) {
    const parsed = CreateCustomerSchema.safeParse(data);

    if (!parsed.success) {
      return {
        status: 400,
        body: buildErrorResponse(
          'Dados inválidos',
          parsed.error.flatten().fieldErrors as Record<string, string[]>
        ),
      };
    }

    const customer = await CreateCustomer(parsed.data);

    return { status: 201, body: customer };
  },

  async update(id: string, data: unknown) {
    const existing = await findCustomerById(id);

    if (!existing) {
      return {
        status: 404,
        body: buildErrorResponse('Cliente não encontrado.'),
      };
    }

    const parsed = UpdateCustomerSchema.safeParse(data);

    if (!parsed.success) {
      return {
        status: 400,
        body: buildErrorResponse(
          'Dados inválidos',
          parsed.error.flatten().fieldErrors as Record<string, string[]>
        ),
      };
    }

    const customer = await updateCustomer(id, parsed.data);

    return {
      status: 200,
      body: customer,
    };
  },

async remove (id: string){
	const existing = await findCustomerById(id);

    if (!existing) {
      return {
        status: 404,
        body: buildErrorResponse('Cliente não encontrado.'),
      };
    }
	await deleteCustomer (id);
	return {status: 200, body: {message: 'Cliente removido com sucesso'}}
}
  
};



