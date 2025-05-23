'use client';

import { useState } from 'react';
import { deleteChatRoomAction } from "../actions";
import ConfirmModal from './confirm-modal';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
    chatRoomId: string;
}

export default function DeleteButton({ chatRoomId }: DeleteButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteChatRoomAction(chatRoomId);
            setIsModalOpen(false);
            router.refresh(); // 채팅 리스트 새로고침
        } catch (error) {
            console.error('채팅방 삭제 중 오류 발생:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsModalOpen(true);
                }}
                className="text-gray-400 hover:text-red-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
            </button>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="채팅방 삭제"
                message="정말로 이 채팅방을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                isDeleting={isDeleting}
            />
        </>
    );
} 