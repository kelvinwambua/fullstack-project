import {Box} from '@chakra-ui/react';
import exp from 'constants';

export type WrapperVariant = "small" | "regular";
interface WrapperProps {
  children: React.ReactNode;
  variant?: WrapperVariant	
}

const Wrapper: React.FC<WrapperProps> = ({ children, variant='regular' }) => {
    return (
        <Box mt={8} mx="auto" maxW={variant==='regular'?"800px":"400px"} w="100%">
            {children}
        </Box>
    );
};
export default Wrapper;