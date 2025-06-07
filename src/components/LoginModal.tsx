import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { FaGoogle } from 'react-icons/fa';
import { signinWithGoogle } from '@/utils/actions';

type LoginModalProps = {
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
};
export const LoginModal = ({
    showLoginModal,
    setShowLoginModal,
}: LoginModalProps) => {
    return (
        <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sign in to CryptoDash</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Button
                        type="button"
                        onClick={signinWithGoogle}
                        variant="outline"
                        className="flex items-center gap-2"
                    >
                        <FaGoogle /> Sign in with Google
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
