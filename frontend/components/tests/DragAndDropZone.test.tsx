import { render, screen, fireEvent } from "@testing-library/react";
import DragDropZone from "@/components/DragAndDropZone";

function makeFile(name: string, type: string) {
  return new File(["dummy content"], name, { type });
}

describe("DragDropZone", () => {
  it("renders the default prompt", () => {
    render(<DragDropZone onFileSelected={jest.fn()} />);
    expect(screen.getByText(/click or drag & drop an image/i)).toBeInTheDocument();
  });

  it("calls onFileSelected when a valid image is chosen via the file input", () => {
    const onFileSelected = jest.fn();
    render(<DragDropZone onFileSelected={onFileSelected} />);

    const file = makeFile("photo.png", "image/png");
    const input = screen
      .getByText(/click or drag & drop an image/i)
      .parentElement!.querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelected).toHaveBeenCalledTimes(1);
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("rejects a non-image file: shows an alert and does not call onFileSelected", () => {
    const onFileSelected = jest.fn();
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<DragDropZone onFileSelected={onFileSelected} />);

    const file = makeFile("notes.txt", "text/plain");
    const input = screen
      .getByText(/click or drag & drop an image/i)
      .parentElement!.querySelector("input[type='file']") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    expect(onFileSelected).not.toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("Please upload an image file.");

    alertSpy.mockRestore();
  });

  it("switches to the 'drop here' prompt while dragging over, and reverts on drag leave", () => {
    render(<DragDropZone onFileSelected={jest.fn()} />);

    const zone = screen.getByText(/click or drag & drop an image/i).parentElement!;

    fireEvent.dragOver(zone);
    expect(screen.getByText(/drop the image here/i)).toBeInTheDocument();

    fireEvent.dragLeave(zone);
    expect(screen.getByText(/click or drag & drop an image/i)).toBeInTheDocument();
  });

  it("calls onFileSelected with the dropped file when a valid image is dropped", () => {
    const onFileSelected = jest.fn();
    render(<DragDropZone onFileSelected={onFileSelected} />);

    const zone = screen.getByText(/click or drag & drop an image/i).parentElement!;
    const file = makeFile("photo.png", "image/png");

    fireEvent.drop(zone, { dataTransfer: { files: [file] } });

    expect(onFileSelected).toHaveBeenCalledTimes(1);
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("does not call onFileSelected when a non-image file is dropped", () => {
    const onFileSelected = jest.fn();
    jest.spyOn(window, "alert").mockImplementation(() => {});

    render(<DragDropZone onFileSelected={onFileSelected} />);

    const zone = screen.getByText(/click or drag & drop an image/i).parentElement!;
    const file = makeFile("notes.txt", "text/plain");

    fireEvent.drop(zone, { dataTransfer: { files: [file] } });

    expect(onFileSelected).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
