"use client";

import DropdownMenu from "@/components/dropdown-menu/dropdown";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table/table-shadcn";

import api from "@/services/api";
import { User } from "@/types/user";
import c from "@/utils/c";
import { format } from "@/utils/helpers";
import { useEffect, useState } from "react";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);

  const getCustomers = async () => {
    const res = await api.get<User[]>("/customer");
    
    if (res.ok && res.data) {
      setUsers(res.data);
    } else {
      console.error("Failed to fetch users", res.data);
    }
  };

  const getCustomerById = async (customerId: string) => {
    const res = await api.get<User[]>(`/customer/${customerId}`);
    if (res.ok && res.data) {
      setUsers(res.data);
    } else {
      console.error("Failed to fetch users", res.data);
    }
  };

  const updateCustomer = async (customer: User) => {
    const res = await api.get<User[]>(`/customer/${customer.id}`);
    if (res.status === 204) {
      getCustomers();
    } else {
      console.error("Failed to fetch users", res.data);
    }
  };

  useEffect(() => {
    getCustomers();
  }, []);

  const options = [
    {
      label: "Editar usuário",
      onClick: () => {
        console.log("Editar");
      },
    },
    {
      label: "Remover assinatura",
      onClick: () => {
        console.log("Remover");
      },
    },
    {
      label: "Renovar assinatura",
      onClick: () => {
        console.log("Remover");
      },
    },
  ];

  return (
    <div className="flex container mx-auto flex-col gap-10 my-20 items-center justify-center border-red">
      <h1 className="text-3xl font-bold">Meus clientes</h1>
      <Table className="border">
        <TableHeader>
          <TableRow>
            <TableHead>Celular</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="text-center">Última visita</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{user.phoneNumber}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell
                className={c({
                  "text-center": !user.lastVisit,
                })}
              >
                {user.lastVisit || "-"}
              </TableCell>

              <TableCell className="text-right">
                <DropdownMenu
                  openUpwards={index > users.length - 3 && users.length > 5}
                  className="w-24 rounded-full"
                  triggerLabel="Opções"
                  options={options}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
