package project;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.*;
import java.io.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.List;

class main {
    String category, subcategory;
    double amount;
    LocalDate date;

    public Expense(String category, String subcategory, double amount, LocalDate date) {
        this.category = category;
        this.subcategory = subcategory;
        this.amount = amount;
        this.date = date;
    }

    public String toFileString() {
        return category + "," + subcategory + "," + amount + "," + date;
    }

    public static Expense fromFileString(String line) {
        String[] parts = line.split(",");
        return new Expense(parts[0], parts[1], Double.parseDouble(parts[2]), LocalDate.parse(parts[3]));
    }
}

public class ExpenseTrackerPro extends JFrame {
    private List<Expense> expenses = new ArrayList<>();
    private DefaultTableModel tableModel;
    private JTable table;
    private DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public ExpenseTrackerPro() {
        setTitle("Personal Expense Tracker Pro");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Table
        tableModel = new DefaultTableModel(new String[]{"Date", "Category", "Subcategory", "Amount"}, 0);
        table = new JTable(tableModel);
        add(new JScrollPane(table), BorderLayout.CENTER);

        // Buttons
        JPanel panel = new JPanel();
        JButton addBtn = new JButton("Add Expense");
        JButton summaryBtn = new JButton("Monthly Pie Chart");
        JButton exportBtn = new JButton("Export CSV");
        panel.add(addBtn);
        panel.add(summaryBtn);
        panel.add(exportBtn);
        add(panel, BorderLayout.SOUTH);

        addBtn.addActionListener(e -> openAddDialog());
        summaryBtn.addActionListener(e -> showPieChart());
        exportBtn.addActionListener(e -> exportCSV());

        loadExpenses();
        refreshTable();
    }

    private void openAddDialog() {
        JTextField categoryField = new JTextField();
        JTextField subcategoryField = new JTextField();
        JTextField amountField = new JTextField();
        JTextField dateField = new JTextField(LocalDate.now().toString());

        Object[] message = {
                "Category:", categoryField,
                "Subcategory:", subcategoryField,
                "Amount:", amountField,
                "Date (YYYY-MM-DD):", dateField
        };

        int option = JOptionPane.showConfirmDialog(this, message, "Add Expense", JOptionPane.OK_CANCEL_OPTION);
        if (option == JOptionPane.OK_OPTION) {
            try {
                Expense e = new Expense(
                        categoryField.getText(),
                        subcategoryField.getText(),
                        Double.parseDouble(amountField.getText()),
                        LocalDate.parse(dateField.getText(), formatter)
                );
                expenses.add(e);
                refreshTable();
                saveExpenses();
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Invalid input!");
            }
        }
    }

    private void refreshTable() {
        tableModel.setRowCount(0);
        for (Expense e : expenses) {
            tableModel.addRow(new Object[]{e.date, e.category, e.subcategory, e.amount});
        }
    }

    private void showPieChart() {
        Map<String, Double> summary = new HashMap<>();
        for (Expense e : expenses) {
            String monthCat = e.date.getMonth() + " - " + e.category;
            summary.put(monthCat, summary.getOrDefault(monthCat, 0.0) + e.amount);
        }

        JFrame chartFrame = new JFrame("Monthly Expense Pie Chart");
        chartFrame.setSize(500, 500);
        chartFrame.setLocationRelativeTo(this);

        JPanel chartPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                double total = summary.values().stream().mapToDouble(Double::doubleValue).sum();
                int startAngle = 0;
                Random rand = new Random();

                for (Map.Entry<String, Double> entry : summary.entrySet()) {
                    int arcAngle = (int) Math.round((entry.getValue() / total) * 360);
                    g.setColor(new Color(rand.nextInt(256), rand.nextInt(256), rand.nextInt(256)));
                    g.fillArc(50, 50, 400, 400, startAngle, arcAngle);
                    startAngle += arcAngle;
                }

                int y = 470;
                int x = 10;
                for (Map.Entry<String, Double> entry : summary.entrySet()) {
                    g.setColor(Color.BLACK);
                    g.drawString(entry.getKey() + ": $" + String.format("%.2f", entry.getValue()), x, y);
                    y += 15;
                }
            }
        };
        chartFrame.add(chartPanel);
        chartFrame.setVisible(true);
    }

    private void exportCSV() {
        try (PrintWriter pw = new PrintWriter("expenses_export.csv")) {
            pw.println("Date,Category,Subcategory,Amount");
            for (Expense e : expenses) pw.println(e.toFileString());
            JOptionPane.showMessageDialog(this, "Exported to expenses_export.csv");
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this, "Error exporting CSV");
        }
    }

    private void saveExpenses() {
        try (PrintWriter pw = new PrintWriter("expenses.txt")) {
            for (Expense e : expenses) pw.println(e.toFileString());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    private void loadExpenses() {
        try (Scanner sc = new Scanner(new File("expenses.txt"))) {
            while (sc.hasNextLine()) expenses.add(Expense.fromFileString(sc.nextLine()));
        } catch (FileNotFoundException e) {
            System.out.println("No saved expenses found, starting fresh.");
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new ExpenseTrackerPro().setVisible(true));
    }
}
	