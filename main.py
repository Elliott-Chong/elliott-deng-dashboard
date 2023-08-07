import csv

def generate_insert_statement(row):
    # Generate the INSERT statement based on the row data
    product_id = row[0]
    product_name = row[1]
    description = row[2]
    standard_cost = row[3]
    list_price = row[4]
    category_id = row[5]

    insert_statement = f"INSERT INTO contacts (product_id, product_name, description, standard_cost, list_price, category_id) VALUES ({product_id}, '{product_name}', '{description}', '{standard_cost}', '{list_price}', {category_id});"
    return insert_statement

def generate_sql_file(csv_file, sql_file):
    # Open the CSV file for reading
    with open(csv_file, 'r') as file:
        reader = csv.reader(file)
        next(reader)  # Skip the header row

        # Open the SQL file for writing
        with open(sql_file, 'w') as sql_file:
            # Iterate over each row in the CSV file
            for row in reader:
                insert_statement = generate_insert_statement(row)
                sql_file.write(insert_statement + '\n')

    print(f"SQL file '{sql_file}' generated successfully.")

# Example usage
csv_file = 'products.csv'
sql_file = 'insert_contacts.sql'
generate_sql_file(csv_file, sql_file)

