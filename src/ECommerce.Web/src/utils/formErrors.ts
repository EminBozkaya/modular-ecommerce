import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

// Backend FluentValidation hata response formatı
interface ApiValidationError {
    errors: Record<string, string[]>;
}

/**
 * Backend 400 döndüğünde FluentValidation hatalarını
 * react-hook-form field'larına map eder.
 *
 * Kullanım:
 * ```ts
 * try {
 *   await apiCall(data);
 * } catch (error) {
 *   applyServerErrors(error, setError);
 * }
 * ```
 */
export function applyServerErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
): void {
    const apiError = error as { response?: { data?: ApiValidationError } };
    const errors = apiError?.response?.data?.errors;

    if (!errors) return;

    Object.entries(errors).forEach(([field, messages]) => {
        // Backend PascalCase → frontend camelCase dönüşümü
        const fieldName = field.charAt(0).toLowerCase() + field.slice(1);
        setError(fieldName as Path<T>, {
            type: 'server',
            message: messages[0],
        });
    });
}
