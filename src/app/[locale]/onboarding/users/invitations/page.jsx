import Onboarding from './Onboarding';
import { InvalidLink } from '../../components/InvalidLink';

const Page = ({ searchParams }) => {
  /*
    Info del link:
    
    En esta sección los parámetros "t" y "id" hacen referencia a información del token y del link en sí.
    Los parámetros se colocaron de esta forma para que sean difíciles de descifrar por parte del cliente.
    
    "t": Significa "token" y es el token identificador único generado en el back al momento de generar el link
    "id": Es el ID del link en el back para una identificación más rápida al momento de la verificación.
    "e": Significa "email" y se envía con valor "t" cuando se necesita pedir el email al momento del registro.
        Esto es útil para links generados donde no se cuenta con un pre-registro.
        Al no contar con un pre-registro, no se tiene conocimiento del correo del usuario ni ningún otro dato.
  */

  const { t, id, e } = searchParams;

  return !t || !id ? <InvalidLink /> : <Onboarding token={t} linkId={id} requestEmail={e && e === 't'} />;
};

export default Page;
