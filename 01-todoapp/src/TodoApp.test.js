// src/App.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import TodoApp from './TodoApp';

describe('TodoApp', () => {
  test('aggiunge un nuovo todo', () => {
    render(<TodoApp />);
    
    // Trova l'input e il bottone
    const input = screen.getByPlaceholderText('Cosa devi fare?');
    const button = screen.getByText('Aggiungi');
    
    // Simula l'inserimento di testo e il click del bottone
    fireEvent.change(input, { target: { value: 'Nuovo todo di test' } });
    fireEvent.click(button);
    
    // Verifica che il todo sia stato aggiunto
    expect(screen.getByText('Nuovo todo di test')).toBeInTheDocument();
    // Verifica che l'input sia stato pulito
    expect(input.value).toBe('');
  });

  test('segna un todo come completato', () => {
    render(<TodoApp />);
    
    // Aggiunge un todo
    const input = screen.getByPlaceholderText('Cosa devi fare?');
    fireEvent.change(input, { target: { value: 'Todo da completare' } });
    fireEvent.click(screen.getByText('Aggiungi'));
    
    // Trova il checkbox e lo clicca
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    // Verifica che il todo sia segnato come completato
    const todoText = screen.getByText('Todo da completare');
    expect(todoText).toHaveClass('completed');
  });

  test('elimina un todo', () => {
    render(<TodoApp />);
    
    // Aggiunge un todo
    const input = screen.getByPlaceholderText('Cosa devi fare?');
    fireEvent.change(input, { target: { value: 'Todo da eliminare' } });
    fireEvent.click(screen.getByText('Aggiungi'));
    
    // Verifica che il todo sia presente
    expect(screen.getByText('Todo da eliminare')).toBeInTheDocument();
    
    // Trova il bottone elimina e lo clicca
    const deleteButton = screen.getByText('Elimina');
    fireEvent.click(deleteButton);
    
    // Verifica che il todo sia stato eliminato
    expect(screen.queryByText('Todo da eliminare')).not.toBeInTheDocument();
  });

  test('non aggiunge todo vuoti', () => {
    render(<TodoApp />);
    
    // Prova ad aggiungere un todo vuoto
    const button = screen.getByText('Aggiungi');
    fireEvent.click(button);
    
    // Verifica che non ci siano elementi nella lista
    const todoItems = screen.queryAllByRole('listitem');
    expect(todoItems).toHaveLength(0);
  });
});