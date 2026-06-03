import { Form, Head } from '@inertiajs/react';
import { PageHeader, TableShell } from '@/components/portal/admin-table';
import { Button } from '@/components/ui/button';

export default function ContactMessagesIndex({ messages }: { messages: any }) {
    return (
        <div className="p-6">
            <Head title="Contact messages" />
            <PageHeader title="Contact messages" description="Read and manage contact form submissions." />
            <TableShell
                page={messages}
                columns={['Sender', 'Subject', 'Message', 'Status', 'Actions']}
                render={(message: any) => (
                    <>
                        <td className="px-4 py-3">
                            <div className="font-medium">{message.name}</div>
                            <div className="text-muted-foreground">{message.email}</div>
                            <div className="text-muted-foreground">{message.phone}</div>
                        </td>
                        <td className="px-4 py-3 font-medium">{message.subject}</td>
                        <td className="max-w-md px-4 py-3 text-muted-foreground">{message.message}</td>
                        <td className="px-4 py-3">{message.is_read ? 'Read' : 'Unread'}</td>
                        <td className="px-4 py-3">
                            <div className="flex gap-2">
                                {!message.is_read && (
                                    <Form action={`/admin/contact-messages/${message.id}/read`} method="patch">
                                        <Button size="sm" variant="outline">Mark read</Button>
                                    </Form>
                                )}
                                <Form action={`/admin/contact-messages/${message.id}`} method="delete">
                                    <Button size="sm" variant="destructive">Delete</Button>
                                </Form>
                            </div>
                        </td>
                    </>
                )}
            />
        </div>
    );
}
