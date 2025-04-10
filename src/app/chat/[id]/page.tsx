import { loadChat } from "@/db/chatRepository";
import Chat from "../../../components/Chat";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  // Ensure we're properly handling the dynamic route parameter
  const { id } = await params;

  const messages = await loadChat(id);

  return <Chat id={id} initialMessages={messages} />;
}
