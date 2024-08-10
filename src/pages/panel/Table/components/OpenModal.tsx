import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
} from '@nextui-org/react';

export default function OpenModal({ btn }) {
  const state = useDisclosure();
  const { isOpen, onOpen, onOpenChange } = state;
  return (
    <>
      {btn?.(state)}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">返回数据</ModalHeader>
              <ModalBody className="h-[300px] flex-1">
                <Textarea className="h-full flex-1" />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button color="primary" onPress={onClose}>
                  更新
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
