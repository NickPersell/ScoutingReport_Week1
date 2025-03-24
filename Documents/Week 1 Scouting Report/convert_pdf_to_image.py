from pdf2image import convert_from_path
import os

def convert_pdf_to_images(pdf_path, output_prefix):
    try:
        # Verify PDF exists
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"{pdf_path} not found in the project folder")

        # Convert all pages of the PDF to images
        images = convert_from_path(
            pdf_path,
            poppler_path=r"C:\Users\npersell\Poppler\poppler-24.08.0\Library\bin"  # Adjust if needed
        )

        # Save each page as a separate image
        for i, image in enumerate(images, start=1):
            output_path = f"{output_prefix}-{i}.png"
            image.save(output_path, 'PNG')
            print(f"Successfully converted page {i} of {pdf_path} to {output_path}")

        return len(images)  # Return the number of pages

    except Exception as e:
        print(f"Error converting {pdf_path}: {e}")
        return 0

def main():
    # List of PDFs to convert
    pdfs_to_convert = [
        ('main.pdf', 'main'),
        ('offense.pdf', 'offense'),
        ('defense.pdf', 'defense'),
        ('special-teams.pdf', 'special-teams')
    ]

    # Convert each PDF
    for pdf_path, output_prefix in pdfs_to_convert:
        num_pages = convert_pdf_to_images(pdf_path, output_prefix)
        print(f"Total pages converted for {pdf_path}: {num_pages}")

if __name__ == "__main__":
    main()