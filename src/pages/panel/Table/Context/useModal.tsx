import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useCallback, useState } from 'react';

const useModal = () => {
  // const { isOpen, onOpen:_onopen } = useDisclosure();
  const [content, setContent] = useState(null);

  const [visible, setVisible] = useState(false);
  const onOpenChange = value => {
    console.log('onOpenChange', value);
    setVisible(value);
    if (!value) {
      setContent(null);
    }
  };
  const onOpen = p => {
    setContent(p);
    console.log('onOpen');
    setVisible(true);
  };
  const ModalComponent = () => (
    <Modal isOpen={visible} onOpenChange={onOpenChange}>
      <ModalContent>
        {onClose => (
          <>
            <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
            <ModalBody>{content}</ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );

  return {
    visible,
    onOpen,
    onOpenChange,
    ModalComponent,
  };
};

export default useModal;
