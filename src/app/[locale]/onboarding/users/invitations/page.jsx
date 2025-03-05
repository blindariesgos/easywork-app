import Onboarding from './Onboarding';
import { InvalidLink } from '../../components/InvalidLink';

const Page = async ({ searchParams }) => {
  // En esta sección los parámetros "t" y "id" hacen referencia a información del token y del link en sí.
  // "t": Significa "token" y es el token identificador único generado en el back al momento de generar el link
  // "id": Es el ID del link en el back para una identificación más rápida al momento de la verificación.

  const { t, id } = searchParams;

  return !t || !id ? <InvalidLink /> : <Onboarding token={t} linkId={id} />;
};

export default Page;
