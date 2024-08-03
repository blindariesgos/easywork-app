import SelectInput from "../../../../../../../../components/form/SelectInput"
import PhysicalContactForm from "../physicalContactForm"
import MoralContactForm from "../moralContactForm"
import { useState } from "react"

const Contact = () => {
    const [type, setType] = useState()
    return (
        <div className="py-4">
            <div className="grid grid-cols-3">
                <div className="bg-gray-100 p-4">
                    <SelectInput
                        label="Tipo de persona"
                        options={[
                            {
                                name: "Fisica",
                                id: "physical"
                            },
                            {
                                name: "Moral",
                                id: "moral"
                            }
                        ]}
                        placeholder="- Seleccionar -"
                        setSelectedOption={(e) => setType(e.id)}
                    />
                </div>
            </div>

            {
                type &&
                (type == "physical"
                    ? <PhysicalContactForm />
                    : <MoralContactForm />)
            }
        </div>
    );
}

export default Contact;