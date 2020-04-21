import { conatinerFluid } from '../../../nextjs-material-kit';
import imagesStyle from '../../../nextjs-material-kit/imagesStyles';

const exampleStyle = {
  section: {
    padding: '70px 0',
  },
  container: {
    ...conatinerFluid,
    textAlign: 'center !important',
  },
  ...imagesStyle,
  link: {
    textDecoration: 'none',
  },
};

export default exampleStyle;
