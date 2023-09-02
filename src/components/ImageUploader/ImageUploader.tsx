import { FieldProps } from 'formik';

import { ImageDropbox } from 'components/ImageDropbox';
import { ImagePreview, ImagePreviewMode } from 'components/ImagePreview';
import { InputField, InputFieldExternalProps } from 'components/InputField';
import { readFileAsBase64 } from 'common/helpers';
import { FileWithUrl } from 'common/types';

type ImageUploaderProps = InputFieldExternalProps & {
  name: string;
  variant?: ImagePreviewMode;
};

export const ImageUploader = ({
  variant = ImagePreviewMode.Thumbnail,
  ...inputFieldProps
}: ImageUploaderProps): JSX.Element => (
  <InputField {...inputFieldProps}>
    {({
      field: { name, value },
      form: { setFieldValue },
      meta: { error },
    }: FieldProps<string | null>) => {
      const image = value;

      const setImage = async (image: FileWithUrl | null): Promise<void> => {
        if (image === null) setFieldValue(name, image);
        else {
          const fileAsBase64 = await readFileAsBase64(image);
          setFieldValue(name, fileAsBase64);
        }
      };

      const handleUpload = (image: FileWithUrl): void => {
        setImage(image);
      };

      const handleClear = (): void => {
        setImage(null);
      };

      return !image ? (
        <ImageDropbox onDrop={handleUpload} externalError={error} />
      ) : (
        <ImagePreview variant={variant} image={image} onClear={handleClear} />
      );
    }}
  </InputField>
);
