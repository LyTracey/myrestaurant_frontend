import { MenuContext } from ".."
import { useContext, useState } from "react"
import { useNavigate, useParams, useRevalidator } from "react-router-dom"
import { useForm } from "react-hook-form"
import { dataAPI } from "../../../api/axiosInstances"
import { externalEndpoints, internalEndpoints } from "../../../data/endpoints"
import Modal from "react-bootstrap/Modal"
import { DisplayFeedback } from "../../../components/messages/base"
import { DeleteAlert } from "../../../components/messages/base"
import { ErrorMessage } from "@hookform/error-message"
import Form from "react-bootstrap/Form"
import ICONS from "../../../data/icons"
import { GlobalContext } from "../../../App"
import { DEFAULT_MENU } from "../constants"
import { MenuType } from "../menu.types"

function MenuForm() {
  // Get context values
  const {
    theme: [theme],
  } = useContext(GlobalContext)
  const { menu, inventory }: any = useContext(MenuContext)
  const { id } = useParams()
  let updateObj = id ? { ...menu[id] } : DEFAULT_MENU
  const { DeleteIcon } = ICONS

  // Change array to input format - fill missing values with false
  updateObj.ingredients = Object.keys(inventory).map((inventoryID: string) =>
    Object.keys(updateObj.ingredients).includes(inventoryID)
      ? inventoryID
      : false
  )

  // Utils
  const navigate = useNavigate()
  const revalidator = useRevalidator()
  const [showDelete, setShowDelete] = useState<boolean>(false)

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
  } = useForm<MenuType>({
    defaultValues: { ...updateObj },
  })

  const ingredients = watch("ingredients")
  const units = watch("units")

  const submitHandler = handleSubmit(async (data) => {
    const requestData = {
      title: data.title,
      description: data.description,
      price: data.price,
      "ingredients[]": ingredients
        .filter((item: string | boolean): item is string => !!item)
        .map((item: string) => parseInt(item)),
      "units{}": Object.fromEntries(
        Object.entries(units).filter(
          (unitsArray: [string, number | undefined]) => !!unitsArray[1]
        )
      ),
    }

    if (id) {
      await dataAPI.patch(
        `${externalEndpoints.menu!}${data.slug}/`,
        requestData
      )
    } else {
      await dataAPI.post(externalEndpoints.menu!, requestData)
    }

    navigate(internalEndpoints.menu!)
    revalidator.revalidate()
  })

  const deleteHandler = async () => {
    await dataAPI.delete(`${externalEndpoints.menu}${updateObj.slug}/`)

    navigate(internalEndpoints.menu!)
    revalidator.revalidate()
  }

  return (
    <Modal
      className={theme}
      show={true}
      onHide={() => navigate(internalEndpoints.menu!)}
    >
      <Modal.Header closeButton>
        <h3 className="title">
          {id ? `Update Menu Item ${updateObj.title}` : "Create Menu Item"}
        </h3>
      </Modal.Header>
      <Modal.Body>
        <DisplayFeedback />

        {showDelete && (
          <DeleteAlert
            onClickYes={() => deleteHandler()}
            onClickCancel={() => setShowDelete(false)}
          />
        )}

        {id && (
          <div className="actions">
            <button
              title="Delete menu item"
              type="button"
              className="button delete"
              onClick={() => setShowDelete(true)}
            >
              <DeleteIcon /> Delete
            </button>
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="title">
            <label className="input-label">Title *</label>
            <input
              {...register("title", {
                disabled: id ? true : false,
                required: true,
                maxLength: {
                  value: 50,
                  message: "The max length is 50 characters.",
                },
              })}
            />

            <div className="feedback">
              <ErrorMessage errors={errors} name="title" />
            </div>
          </div>

          <div className="description">
            <label className="input-label">Description</label>
            <input {...register("description")} />

            <div className="feedback">
              <ErrorMessage errors={errors} name="description" />
            </div>
          </div>

          <div className="price">
            <label className="input-label">Price *</label>
            <input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Please enter a price.",
                min: {
                  value: 0,
                  message: "Minimum value is 0.00.",
                },
              })}
            />

            <div className="feedback">
              <ErrorMessage errors={errors} name="price" />
            </div>
          </div>

          <div className="multi-input">
            <div className="ingrdients">
              <label>Available ingredients</label>
              {Object.entries(inventory).map(
                (inventoryArray: any, i: number) => {
                  return (
                    <div
                      className="check-input-container"
                      key={`ingredients_reference_${i}`}
                    >
                      <Form.Check
                        className="check-input"
                        id={`menuItem.${i}`}
                        value={inventoryArray[0]}
                        type="checkbox"
                        {...register(`ingredients.${i}`, {
                          onChange: (e) => {
                            if (!e.target.checked) {
                              let newUnits = { ...units }
                              delete newUnits[inventoryArray[0]]
                              setValue("units", newUnits)
                            }
                          },
                        })}
                      />
                      <Form.Label className="input-label check-label">
                        {inventoryArray[1]}
                      </Form.Label>
                    </div>
                  )
                }
              )}
            </div>

            <div className="units">
              <label>Units required</label>
              {Object.keys(inventory).map((inventoryID: string) => {
                return (
                  <div key={`units_${inventoryID}`}>
                    <div className="units-input">
                      {
                        <input
                          type="number"
                          step="0.05"
                          {...register(`units.${inventoryID}`, {
                            disabled: !ingredients.includes(inventoryID),
                            required:
                              "Please enter a the number of units required.",
                            valueAsNumber: true,
                          })}
                        />
                      }
                    </div>

                    <div className="feedback">
                      <ErrorMessage
                        errors={errors}
                        name={`units.${inventoryID}`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button className="button submit" type="submit">
            Submit
          </button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default MenuForm
