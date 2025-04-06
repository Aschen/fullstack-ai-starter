import { loadChat } from "@/db/chatRepository";
import Chat from "../../../components/Chat";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const messages = await loadChat(id);

  return <Chat id={id} initialMessages={messages} />;
}
